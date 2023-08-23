import React, { useState } from 'react'
import { Form, Row, Col, Button, Container } from 'react-bootstrap'
import axios from 'axios'

const FormPage = () => {
  const [errorORsuccess, setEorS] = useState(null)
  const [passage, setPassage] = useState('')
  const [passageType, setPassageType] = useState(null)
  const [fields, setFields] = useState([
    {
      id: 0,
      question: '',
      answer: '',
      passage_type: '',
      comprehension_level: '',
      question_type: '',
      answer_entity: '',
      question_group: '',
      passage: passage,
      annotator_name: '',
    },
  ])

  const handleChangeInput = (i, e) => {
    const values = [...fields]
    values[i][e.target.name] = e.target.value
    setFields(values)
  }

  const handlePassage = () => {
    var config = {
      method: 'get',
      url: 'http://localhost:5000/api/users/getPassage',
      headers: {},
    }

    axios(config)
      .then(async function (response) {
        await setPassage(response.data.paragraphs.context)
        await setPassageType(response.data.paragraphs.passage_type)
        setFields([
          {
            id: 0,
            question: '',
            answer: '',
            passage_type: response.data.paragraphs.passage_type,
            comprehension_level: '',
            question_type: '',
            answer_entity: '',
            question_group: '',
            passage: response.data.paragraphs.context,
            annotator_name: '',
          },
        ])
        // console.log(response.data.passage_type[0]);
        console.log(response.data);
        console.log(response.data.paragraphs.passage_type);
        console.log(response.data.paragraphs.context);
      })
      .catch(function (error) {
        console.log(error)
      })
  }

  const handleAdd = (id) => {
    setFields([
      ...fields,
      {
        id: id + 1,
        question: '',
        answer: '',
        passage_type: '',
        comprehension_level: '',
        question_type: '',
        answer_entity: '',
        question_group: '',
        annotator_name: '',
      },
    ])
  }

  const handleDelete = (id) => {
    var length = fields.length
    if (length !== 1)
      setFields((fields) => fields.filter((_, index) => index !== length - 1))
  }

  const handleSubmit = () => {
    var axios = require('axios')
    var data = JSON.stringify({
      user: JSON.parse(localStorage.getItem('userInfo'))._id,
      passage: passage,
      fields: fields,
    })

    var config = {
      method: 'post',
      url: 'http://localhost:5000/api/users/updatePassageInfo',
      headers: {
        'Content-Type': 'application/json',
      },
      data: data,
    }

    axios(config)
      .then(function (response) {
        setEorS('Submitted!')
      })
      .catch(function (error) {
        setEorS('Error')
      })

    console.log({ passage: passage, fields: fields })
  }

  return (
    <Container>
      <Form className='py-5 formContainer text-center'>
        <Form.Label>Paragraph</Form.Label>
        <Form.Control
          as='textarea'
          rows={7}
          disabled
          readOnly
          value={passage}
        />
        <Button variant='primary' className='my-3 mx-2' onClick={handlePassage}>
          Get a paragraph
        </Button>
        <Button
          variant='primary'
          className='my-3 mx-2'
          onClick={() => handleAdd(0)}
        >
          Add another question
        </Button>
        <Button
          variant='primary'
          className='my-3 mx-2'
          onClick={() => handleDelete(0)}
        >
          Delete question
        </Button>
        <Form.Group>
          {fields.map((field, i) => (
            <div key={field.id} className='mb-5'>
              <Form.Group className='mb-3' controlId='formGridAddress1'>
                <Form.Label>Question</Form.Label>
                <Form.Control
                  name='question'
                  value={field.question}
                  onChange={(e) => handleChangeInput(i, e)}
                />
              </Form.Group>
              <Form.Group className='mb-3' controlId='formGridAddress1'>
                  <Form.Label>Answer</Form.Label>
                  <Form.Control
                    name='answer'
                    value={field.answer}
                    onChange={(e) => handleChangeInput(i, e)}
                  />
                </Form.Group>
              <Row className='mb-3'>
                <Form.Group as={Col} controlId='formGridCity'>
                  <Form.Label>Name</Form.Label>
                  <Form.Control
                    name='annotator_name'
                    value={field.annotator_name}
                    onChange={(e) => handleChangeInput(i, e)}
                  />
                </Form.Group>
                

                <Form.Group as={Col} controlId='formGridState'>
                  <Form.Label>Passage Type</Form.Label>
                  <Form.Select
                    defaultValue='Choose...'
                    name='passage_type'
                    value={passageType}
                    onChange={(e) => handleChangeInput(i, e)}
                    disabled
                  >
                    <option value={passageType}> {passageType} </option>{' '}
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId='formGridState'>
                  <Form.Label>Comprehension Level</Form.Label>
                  <Form.Select
                    defaultValue=''
                    name='comprehension_level'
                    onChange={(e) => handleChangeInput(i, e)}
                    disabled
                  >
                    <option value='Inferential'>Inferential</option>
                    <option value='Literal'>Literal</option>
                    <option value='Evaluative'>Evaluative</option>
                    <option value=''> Choose..</option>
                  </Form.Select>
                </Form.Group>
              </Row>

              <Row className='mb-2'>
                <Form.Group as={Col} controlId='formGridState'>
                  <Form.Label>Question Type</Form.Label>
                  <Form.Select
                    defaultValue=''
                    name='question_type'
                    value={field.question_type}
                    onChange={(e) => handleChangeInput(i, e)}
                  >
                    <option value='Who'>Who</option>
                    <option value='Where'>Where</option>
                    <option value='What'>What</option>
                    <option value='When'>When</option>
                    <option value='How many'>How many</option>
                    <option value='How much'>How much</option>
                    <option value='Why'>Why</option>
                    <option value='How'>How</option>
                    <option value=''> Choose..</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId='formGridState'>
                  <Form.Label>Answer Type</Form.Label>
                  <Form.Select
                    defaultValue=''
                    name='answer_entity'
                    value={field.answer_entity}
                    onChange={(e) => handleChangeInput(i, e)}
                  >
                    <option value=''> Choose..</option>
                    <option value='Description'>Description</option>
                    <option value='Person'>Person</option>
                    <option value='Place'>Place</option>
                    <option value='Object'>Object</option>
                    <option value='Date'>Date</option>
                    <option value='Cardinal'>Cardinal</option>
                    <option value='Impossible'>Impossible</option>
                  </Form.Select>
                </Form.Group>

                <Form.Group as={Col} controlId='formGridState'>
                  <Form.Label>Question Group</Form.Label>
                  <Form.Select
                    defaultValue=''
                    name='question_group'
                    value={field.question_group}
                    onChange={(e) => handleChangeInput(i, e)}
                    disabled
                  >
                    <option value='Exact Match'>Exact Match</option>
                    <option value='Lexical Variation (Synonym Matching)'>
                      Lexical Variation (Synonymn Matching)
                    </option>
                    <option value='Lexical Variation (Word Knowledge)'>
                      Lexical Variation (Word Knowledge)
                    </option>
                    <option value='Syntatic Variation'>
                      Syntatic Variation
                    </option>
                    <option value='Multiple Sentence Reasoning'>
                      Multiple Sentence Reasoning
                    </option>
                    <option value='Ambiguous'>Ambiguous</option>
                    <option value='Anaphora Resolution'>
                      Anaphora Resolution
                    </option>
                    <option value='Unanswerable Question'>
                      Unanswerable Question
                    </option>
                    <option value=''> Choose..</option>
                  </Form.Select>
                </Form.Group>
              </Row>
            </div>
          ))}
        </Form.Group>

        <Button variant='primary' className='my-3' onClick={handleSubmit}>
          Submit
        </Button>
        <h1> {errorORsuccess} </h1>
      </Form>
    </Container>
  )
}

export default FormPage
